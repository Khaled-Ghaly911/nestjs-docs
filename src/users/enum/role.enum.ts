import { registerEnumType } from "@nestjs/graphql";

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  GALLERY = 'gallery',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User roles',
});