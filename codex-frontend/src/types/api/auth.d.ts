export type UserLoginDto = {
  email: string;
  password?: string;
};

export type UserInfoDto = {
  email: string;
  role: string;
};

export type LoginResponseDto = {
  accessToken: string;
  expiration: string; 
  user: UserInfoDto;
};


export type UserCreateDto = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
};

export type UserReadDto = {
  id: string; 
  roleId: string; 
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string; 
  updatedAt?: string | null; 
};