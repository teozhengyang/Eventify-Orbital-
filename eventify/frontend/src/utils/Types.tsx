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
}

type AuthToken = {
  access: string;
}

type AuthUser = {
  user_id: number;
  username: string;
}

type LogoutUser = () => void;

const emptyEvent: Event = {
  id: -1,
  name: "",
  description: "",
  start: "",
  end: "",
  location:  "",
  budget: 0,
  organizers: [],
  participants: [],
}

const emptyUser: User = {
  id: -1,
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  email: "",
  budget: 0,
}


export type { Activity, Event, User, AuthToken, AuthUser, LogoutUser };
export { emptyEvent, emptyUser };