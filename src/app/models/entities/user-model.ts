interface UserModel {
  user_guid: ArrayLike<number> | string;
  first_name: string;
  middle_names?: string;
  last_name: string;
}

export { UserModel };
