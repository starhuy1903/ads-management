import { Box, Stack } from '@mui/material';
import { getOrientation } from 'get-orientation/browser';
import { useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg, getRotatedImage } from '@/utils/canvas';
import GeneralModal from './GeneralModal';

const ORIENTATION_TO_ANGLE = {
  '3': 180,
  '6': 90,
  '8': -90,
};

interface CropImageProps {
  image: File;
  onSubmit: () => void;
  onModalClose: () => void;
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default function CropImage({
  image,
  onSubmit,
  onModalClose,
}: CropImageProps) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
      );
      console.log('donee', { croppedImage });
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      if (!image) {
        return;
      }

      let imageDataUrl = await readFile(image);

      try {
        // apply rotation if needed
        const orientation = await getOrientation(image);
        const rotation =
          ORIENTATION_TO_ANGLE[orientation as keyof ORIENTATION_TO_ANGLE];
        if (rotation) {
          imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
        }
      } catch (e) {
        console.warn('failed to detect the orientation');
      }

      setImageSrc(imageDataUrl);
    })();
  }, [image]);

  const body = (
    <Box>
      {imageSrc ? (
        <Cropper
          image={imageSrc}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      ) : null}
    </Box>
  );

  return (
    <GeneralModal
      headerText="Crop Image"
      onModalClose={onModalClose}
      body={body}
      primaryButtonText="Crop"
      onClickPrimaryButton={() => ({})}
      disabledPrimaryButton={false}
    />
  );
}
