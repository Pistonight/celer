use std::io;
use std::net;

use super::client::DevClient;

pub struct DevServer {
    tcp_listener: net::TcpListener,
    clients: Vec<DevClient>,
}

impl DevServer {
    /// Start a new server
    pub fn new(port: u16) -> Result<DevServer, io::Error> {
        let address = format!("localhost:{}", port);
        let tcp_listener = net::TcpListener::bind(address)?;
        tcp_listener.set_nonblocking(true)?;

        let server = DevServer {
            tcp_listener,
            clients: vec![]
        };

        Ok(server)
    }

    /// Close the server
    pub fn stop(&mut self) {
        for client in self.clients.iter_mut() {
            client.close();
        }
    }

    /// Query for new connections and drop closed connections. Returns true if there are new connections
    pub fn query_clients(&mut self) -> bool {
        let mut new_client = false;
        if let Some(result) = self.tcp_listener.incoming().next() {
            match result {
                Ok(stream) => {
                    match DevClient::new(stream) {
                        Err(e_str) => {
                            println!("error: cds: Failed to accept incoming connection: {}", e_str);
                        },
                        Ok(client) => {
                            self.clients.push(client);
                            new_client = true;
                        }
                    }
                },
                Err(ref e) if e.kind() == io::ErrorKind::WouldBlock => {
                    // No incoming connection.
                },
                Err(e) => {
                    println!("error: cds: Failed to accept incoming connection: {:?}", e);
                }
            }
        }

        // drop connection if close
        for client in self.clients.iter_mut()  {
            client.query_close();
        }
        self.clients.retain(|client| !client.is_closed());

        new_client
    }

    /// Send message to all clients. Return the number of clients sent to successfully
    pub fn send(&mut self, message: &str) -> usize {
        let mut send_count = 0;
        for con in self.clients.iter_mut() {
            if con.write(message) {
                send_count+=1;
            }
        }
        send_count
    }

}
