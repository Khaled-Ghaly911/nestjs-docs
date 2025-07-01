import { registerEnumType } from "@nestjs/graphql";

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
  GALLERY = 'gallery',
}

registerEnumType(Roles, {
  name: 'Roles',
  description: 'User roles',
});