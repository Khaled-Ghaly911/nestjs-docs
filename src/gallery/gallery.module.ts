import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryResolver } from './gallery.resolver';

@Module({
  providers: [GalleryService, GalleryResolver]
})
export class GalleryModule {}
