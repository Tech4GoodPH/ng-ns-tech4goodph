export interface IMessage {
    success: boolean;
    message?: string; // optional message for errors when success is false
}