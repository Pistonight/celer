use std::io;
use std::net;

pub struct DevClient {
    ws: tungstenite::WebSocket<net::TcpStream>,
    closed: bool
}

impl DevClient {
    /// Create a new client to wrap the web socket
    pub fn new(stream: net::TcpStream) -> Result<DevClient, String> {
        if let Err(e) = stream.set_nonblocking(true) {
            return Err(format!("{e}"));
        }
        // create ws2 web socket

        match tungstenite::accept(stream) {
            Err(e) => {
                Err(format!("{e}"))
            },
            Ok(ws) => Ok(DevClient {
                ws,
                closed: false
            })
        }
    }

    /// Get if the client is closed
    pub fn is_closed(&self) -> bool {
        self.closed
    }

    /// Poll the client to see if it is closed
    pub fn query_close(&mut self) {
        if let Err(e) = self.ws.read_message() {
            match e {
                tungstenite::error::Error::ConnectionClosed => self.closed = true,
                tungstenite::error::Error::AlreadyClosed => self.closed = true,
                tungstenite::error::Error::Io(io_error) => {
                    match io_error.kind() {
                        io::ErrorKind::WouldBlock => {
                            // No new message from client
                        },
                        _ => {
                            println!("error: cds: io: Error reading message from dev client: {io_error:?}");
                            self.close();
                        }
                    }
                }
                _ => {
                    println!("error: cds: Error reading message from dev client: {e:?}");
                    self.close();
                }
            }
        }
    }

    pub fn close(&mut self) {
        if !self.closed {
            if let Err(e) = self.ws.close(Option::None) {
                println!("error: cds: Error when trying to close the client: {e:?}");
            }
            self.closed = true
        }
    }

    /// Send message to the underlying web socket
    pub fn write(&mut self, message: &str) -> bool {
        match self.ws.write_message(tungstenite::Message::Text(String::from(message))) {
            Err(e) => {
                match e {
                    // Ignore these error since they will cause the client to be dropped in the next cycle
                    tungstenite::error::Error::ConnectionClosed => {},
                    tungstenite::error::Error::AlreadyClosed => {},
                    _ => {
                        println!("error: cds: Error sending message to dev client: {e:?}");
                    }
                }
                false
            },
            Ok(_) => true
        }
    }
}
