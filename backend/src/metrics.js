const metrics = {
  activations: 0,
  generations: 0,
  feedback: []
};

export function logActivation() {
  metrics.activations++;
}

export function logGeneration() {
  metrics.generations++;
}

export function logFeedback(entry) {
  metrics.feedback.push(entry);
}

export function getMetrics() {
  return metrics;
}
