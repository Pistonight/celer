const DELAYS: [u8;4] = [1,2,4,8];
const TIMES: [usize;4] = [40,20,10,1];

pub struct DelayMgr {
    i: usize,
    t: usize
}

impl DelayMgr {
    pub fn new() -> DelayMgr {
        DelayMgr {
            i: 0,
            t: 0
        }
    }

    pub fn reset(&mut self) {
        self.i = 0;
        self.t = 0;
    }

    pub fn slack(&mut self) {
        if self.i < DELAYS.len() {
            if self.t < TIMES[self.i] {
                self.t += 1;
            }else{
                self.i += 1;
                self.t = 0;
            }
        }
    }

    pub fn get_delay(&self) -> u8 {
        if self.i < DELAYS.len() {
            DELAYS[self.i]
        }else{
            DELAYS[DELAYS.len()-1]
        }
    }
}
