use super::step::SourceStep;

/// Struct representing a module, which can either be a single step or an array of steps
#[derive(Debug)]
pub enum SourceModule {
    SingleStep(SourceStep),
    MultiStep(Vec<SourceStep>)
}

impl SourceModule {
    pub fn from(value: &serde_json::Value) -> Self {
        if let Some(arr_value) = value.as_array() {
            let vec = arr_value.iter().map(|x|SourceStep::from(x)).collect();
            return SourceModule::MultiStep(vec);
        }
        return SourceModule::SingleStep(SourceStep::from(value));
    }
    pub fn deep_clone(&self) -> Self {
        match self {
            SourceModule::SingleStep(step) => SourceModule::SingleStep(step.deep_clone()),
            SourceModule::MultiStep(steps) => {
                let mut new_steps = steps.iter().map(|s|s.deep_clone()).collect();
                SourceModule::MultiStep(new_steps)
            }
        }
    }
}