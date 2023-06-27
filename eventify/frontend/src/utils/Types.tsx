// Object types for static typing

type Activity = {
  id: number;
  name: string;
  description: string;
  start: string;
  end: string;
  location: string;
  budget: number;
}

type Event = {
  id: number;
  name: string;
  description: string;
  start: string;
  end: string;
  location: string;
  budget: number;
  organizers: Array<number>;
  participants: Array<number>;
}

type User = {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  budget: number;
  user_id: number;
}

type AuthToken = {
  access: string;
}

type LogoutUser = () => void;


export type { Activity, Event, User, AuthToken, LogoutUser };