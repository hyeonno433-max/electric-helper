export class CreateExpertDto {
    name: string;
    specialty: string;
    region: string;
    rating?: number;
    reviewCount?: number;
    isCertified?: boolean;
}
