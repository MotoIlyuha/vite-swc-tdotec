export function ledBrightness( current: number): number {
    // Примерное значение коэффициента K, которое нужно заменить на реальное
    const K = 0.1; // В этом примере K задано произвольно

    // Расчет яркости
    return K * Math.pow(current, 2);
}

export function getRgbColorByWavelength(wavelength: number): string {
    if (wavelength < 400 || wavelength > 780) {
        return 'null'; // Длина волны вне видимого спектра
    }

    let r, g, b;

    if (wavelength >= 690 && wavelength <= 740) {
        // Красный
        r = 255;
        g = 0;
        b = 0;
    } else if (wavelength >= 590 && wavelength <= 690) {
        // Оранжевый
        r = 255;
        g = 165;
        b = 0;
    } else if (wavelength >= 560 && wavelength <= 590) {
        // Жёлтый
        r = 255;
        g = 255;
        b = 0;
    } else if (wavelength >= 485 && wavelength <= 560) {
        // Зелёный
        r = 0;
        g = 255;
        b = 0;
    } else if (wavelength >= 400 && wavelength <= 485) {
        // Голубой
        r = 0;
        g = 0;
        b = 255;
    } else if (wavelength >= 350 && wavelength <= 400) {
        // Фиолетовый
        r = 128;
        g = 0;
        b = 128;
    } else {
        // Если длина волны не попадает ни в один из диапазонов, возвращаем null
        return 'null';
    }

    return `rgb(${r}, ${g}, ${b})`;
}
