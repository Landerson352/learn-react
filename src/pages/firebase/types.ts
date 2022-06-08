export interface Message {
  uid: string;
  authorName: string;
  text: string;
  time: number;
  avatar?: string; // creator: eran
  triviaAnswer?: string; // creator: linc
}
