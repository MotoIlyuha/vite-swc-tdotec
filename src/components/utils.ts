export function ledBrightness(current: number): number {
    // Примерное значение коэффициента K, которое нужно заменить на реальное
    const K = 0.1; // В этом примере K задано произвольно

    // Расчет яркости
    return K * Math.pow(current, 2);
}

export function getRgbColorByWavelength(wavelength: number): string {
    if (wavelength < 400 || wavelength > 760) {
        throw new Error('Wavelength must be between 400 and 760 nm.');
    }

    // Конвертируем длину волны в оттенок HSL
    let hue: number;
    if (wavelength >= 400 && wavelength <= 440) {
        hue = 240 + ((wavelength - 400) / (440 - 400)) * (260 - 240);
    } else if (wavelength > 440 && wavelength <= 490) {
        hue = 260 + ((wavelength - 440) / (490 - 440)) * (190 - 260);
    } else if (wavelength > 490 && wavelength <= 510) {
        hue = 190 + ((wavelength - 490) / (510 - 490)) * (170 - 190);
    } else if (wavelength > 510 && wavelength <= 580) {
        hue = 170 + ((wavelength - 510) / (580 - 510)) * (60 - 170);
    } else if (wavelength > 580 && wavelength <= 645) {
        hue = 60 + ((wavelength - 580) / (645 - 580)) * (30 - 60);
    } else {
        hue = 30 + ((wavelength - 645) / (760 - 645)) * (0 - 30);
    }

    return `hsl(${hue}, 100%, 50%)`;
}
