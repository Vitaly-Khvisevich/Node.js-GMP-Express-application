export interface UserEntity {
  _id: string; // uuid
  email: string,
  password: string,
  role?: string
}

export interface dataFromReq {
  email: string,
  password: string,
  role?: string
}
