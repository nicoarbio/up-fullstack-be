import { expect, test } from 'vitest'
import User from "../../app/model/user.model.js";

test('Verificar user email', () => {
    const user:User = new User();
    expect(user.getEmail()).equal("", "El email no es correcto");
})
