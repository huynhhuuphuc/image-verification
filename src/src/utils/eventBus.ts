type EventCallback = () => void;

const events: Record<string, EventCallback[]> = {};

export const eventBus = {
  on(event: string, callback: EventCallback) {
    events[event] = events[event] || [];
    events[event].push(callback);
  },
  off(event: string, callback: EventCallback) {
    if (events[event]) {
      events[event] = events[event].filter((cb) => cb !== callback);
    }
  },
  emit(event: string) {
    if (events[event]) {
      events[event].forEach((callback) => callback());
    }
  },
};
