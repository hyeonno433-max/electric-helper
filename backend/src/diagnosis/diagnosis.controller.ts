import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('diagnosis')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: any
  ) {
    console.log('Received diagnosis submission');
    // console.log('Body:', body); // Too verbose
    // console.log('Files:', files);

    // FormData로 들어온 body는 모든 필드가 문자열이므로 변환 필요
    const createDiagnosisDto = new CreateDiagnosisDto();
    createDiagnosisDto.symptoms = body.symptoms;
    createDiagnosisDto.description = body.description;
    createDiagnosisDto.name = body.name;
    createDiagnosisDto.contact = body.contact;

    // 파일 경로 저장 (URL로 변환)
    if (files && files.length > 0) {
      createDiagnosisDto.imageUrl = files.map(file => `http://localhost:8000/uploads/${file.filename}`);
    } else {
      createDiagnosisDto.imageUrl = [];
    }

    return this.diagnosisService.create(createDiagnosisDto);
  }

  @Get()
  findAll() {
    return this.diagnosisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diagnosisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiagnosisDto: UpdateDiagnosisDto) {
    return this.diagnosisService.update(+id, updateDiagnosisDto);
  }

  @Patch(':id/response')
  addResponse(
    @Param('id') id: string,
    @Body('expertComment') expertComment: string,
    @Body('estimatedCost') estimatedCost: number
  ) {
    return this.diagnosisService.addResponse(+id, expertComment, estimatedCost);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.diagnosisService.updateStatus(+id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diagnosisService.remove(+id);
  }
}
