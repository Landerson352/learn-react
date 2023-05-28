import * as UI from '@chakra-ui/react';
import {
  faDownload,
  faImage,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const TileIt: React.FC = () => {
  const [image, setImage] = React.useState<string | null>(null);
  const [scale, setScale] = React.useState<number>(1);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.onload = function () {
        const tileWidth = img.width * scale;
        const tileHeight = img.height * scale;

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (let x = 0; x < window.screen.width; x += tileWidth) {
            for (let y = 0; y < window.screen.height; y += tileHeight) {
              ctx.drawImage(img, x, y, tileWidth, tileHeight);
            }
          }
        }
      };
      img.src = image;
    }
  }, [image, scale]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    if (!e.clipboardData) return;

    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          if (event.target?.result) {
            setImage(event.target.result as string);
          }
        };
        reader.readAsDataURL(blob as Blob);
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleScaleChange = (value: number) => {
    setScale(value);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'tiled.png';
      link.click();
    }
  };

  return (
    <UI.VStack spacing={4} alignItems="start">
      <UI.Text>Paste an image, or select an image file:</UI.Text>
      <UI.Box as="label">
        <UI.Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          display="none"
        />
        <UI.Button colorScheme="blue" as="span" cursor="pointer">
          <FontAwesomeIcon icon={faImage} style={{ marginRight: 8 }} />
          Choose image
        </UI.Button>
      </UI.Box>
      {image ? (
        <React.Fragment>
          <UI.FormControl>
            <UI.FormLabel>Tiling scale</UI.FormLabel>
            <UI.Slider
              min={0.1}
              max={1}
              step={0.1}
              defaultValue={scale}
              onChange={handleScaleChange}
            >
              <UI.SliderTrack>
                <UI.SliderFilledTrack />
              </UI.SliderTrack>
              <UI.SliderThumb boxSize={6}>
                <UI.Box color="tomato" />
              </UI.SliderThumb>
            </UI.Slider>
          </UI.FormControl>
          <UI.Box bg="gray.100" borderRadius="lg">
            <canvas
              ref={canvasRef}
              width={window.screen.width}
              height={window.screen.height}
              style={{ width: '100%' }}
            />
          </UI.Box>
          <UI.Button colorScheme="blue" onClick={handleDownload}>
            <FontAwesomeIcon icon={faDownload} style={{ marginRight: 8 }} />
            Download
          </UI.Button>
        </React.Fragment>
      ) : null}
    </UI.VStack>
  );
};

export { TileIt };
