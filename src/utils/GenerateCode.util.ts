export class GenerateCodeUtil {
  generate(): string {
    const number = Math.floor(100000 + Math.random() * 900000);
    const code = number.toString();

    return code.padStart(6, "0");
  }
}
