interface UserModel {
  user_guid: Uint8Array | string;
  first_name: string;
  middle_names?: string;
  last_name: string;
}

export { UserModel };
