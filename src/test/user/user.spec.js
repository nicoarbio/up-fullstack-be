import { expect, test } from 'vitest';
import User from "../../app/model/User.js";
test('Verificar user email', () => {
    const user = new User();
    expect(user.getEmail()).equal("", "El email no es correcto");
});
