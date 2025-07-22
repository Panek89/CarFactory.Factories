export interface MassTransitMessage {
  namespace: string;
  className: string;
  data: any;
  queue: string;
}
