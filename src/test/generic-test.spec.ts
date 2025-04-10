import { expect, test } from 'vitest'

test('Verificar ok', () => {
    const boolean = true;
    expect(boolean).eq(true, "Debería ser true");
})
