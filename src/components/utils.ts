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

    // Примерное значение цвета, которое нужно заменить на реальное
    const hue = 360 - wavelength;

    return `hsl(${hue}, 100%, 50%)`;
}
