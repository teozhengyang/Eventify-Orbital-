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
  category: string
  shared: boolean
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

type LoginUser = (e: React.FormEvent<HTMLFormElement>) => Promise<void>;


// Empty objects to be used as default placeholder
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

const emptyActivity: Activity = {
  id: -1,
  name: "",
  description: "",
  start: "",
  end: "",
  location: "",
  budget: 0,
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

const emptyAuthUser: AuthUser = {
  user_id: -1,
  username: "",
}

export type { Activity, Event, User, AuthToken, AuthUser, LogoutUser, LoginUser };
export { emptyEvent, emptyUser, emptyActivity, emptyAuthUser };