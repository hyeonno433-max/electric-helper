import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import React, { useState } from "react";

interface Step1CameraProps {
    onNext: (image: File | null) => void;
}

const Step1Camera: React.FC<Step1CameraProps> = ({ onNext }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
                <CardTitle>사진 촬영/업로드</CardTitle>
                <CardDescription>
                    위험해 보이는 전기 설비나 배선 사진을 찍어주세요.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl h-64 bg-gray-900/50 hover:bg-gray-800/50 transition-colors relative overflow-hidden">
                    {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center p-6 space-y-2">
                            <div className="text-4xl">📸</div>
                            <p className="text-gray-400">클릭하여 사진 업로드</p>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                    />
                </div>
                <Button
                    className="w-full"
                    size="lg"
                    onClick={() => onNext(selectedImage)}
                    disabled={!selectedImage}
                >
                    다음: 증상 선택하기
                </Button>
            </CardContent>
        </Card>
    );
};

export default Step1Camera;
