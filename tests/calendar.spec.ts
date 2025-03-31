import { test, expect } from '@playwright/test';

test('Prueba inicial', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page).toHaveTitle("Calendar");
});

test('verificacion "Seleccionar"', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.waitForSelector('table');

  const botonesSeleccionar = await page.$$('button:has-text("Seleccionar")');

  for (let boton of botonesSeleccionar) {
    await boton.click();
  }
  const logs = [];
  page.on('console', (msg) => logs.push(msg.text()));
  await page.waitForTimeout(1000);

  expect(logs).not.toContain('Error');
});

test('verificacion casillas', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.waitForSelector('table');

  const filas = await page.$$('tbody tr');

  for (let fila of filas) {
    for (let i = 1; i <= 7; i++) {
      const casilla = await fila.$(`td:nth-child(${i + 1})`);
      if (casilla) {
        await casilla.click();
      }
    }
  }
  
  const logs = [];
  page.on('console', (msg) => logs.push(msg.text()));
  await page.waitForTimeout(1000);

  expect(logs).not.toContain('Error');
});

test('verificar modales', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.waitForSelector('table');
  const primeraFila = await page.$('tbody tr:first-child');

  if (primeraFila) {
    const primeraCasilla = await primeraFila.$('td:nth-child(2)');
    if (primeraCasilla) {
      await primeraCasilla.click();
    }
  }

  await page.waitForSelector('button:has-text("editar")');
  await page.waitForSelector('button:has-text("eliminar")');

  const btnEditar = await page.$('button:has-text("editar")');
  if (!btnEditar) throw new Error("Botón Editar no encontrado");
  await btnEditar.click();

  const modalEditar = await page.waitForSelector('.modal.show', { state: 'visible' });
  expect(modalEditar).toBeTruthy();

  const btnCerrarModalEditar = await modalEditar.waitForSelector('.btn-close', { state: 'attached' });
  await btnCerrarModalEditar.click();

  await page.waitForSelector('.modal.edit-modal', { state: 'detached' });

  await btnEditar.click();
  await page.waitForSelector('.modal.show', { state: 'visible' });

  const btnCancelarEditar = await page.waitForSelector('.modal.show button:has-text("Cancelar")', { state: 'attached' });
  await btnCancelarEditar.click();

  await page.waitForSelector('.modal.edit-modal', { state: 'detached' });

  await btnEditar.click();
  await page.waitForSelector('.modal.show', { state: 'visible' });

  const inputEditar = await page.waitForSelector('input', { state: 'visible' });
  await inputEditar.fill('Nuevo texto');

  const btnGuardarEditar = await page.waitForSelector('.modal.show button:has-text("Guardar")', { state: 'attached' });
  await btnGuardarEditar.click();

  await page.waitForSelector('.modal.edit-modal', { state: 'detached' });


  if (primeraFila) {
    const primeraCasilla = await primeraFila.$('td:nth-child(2)');
    if (primeraCasilla) {
      await primeraCasilla.click();
    }
  }

  await page.waitForSelector('button:has-text("eliminar")', { state: 'attached' });
  const btnEliminar = await page.$('button:has-text("eliminar")');
  if (!btnEliminar) throw new Error("Botón Eliminar no encontrado");
  await btnEliminar.click();
  
  const modalEliminar = await page.waitForSelector('.modal.show', { state: 'visible' });
  expect(modalEliminar).toBeTruthy();

  const btnCerrarModalEliminar = await modalEliminar.waitForSelector('.btn-close', { state: 'attached' });
  await btnCerrarModalEliminar.click();

  await page.waitForSelector('.modal.delete-modal', { state: 'detached' });

  await btnEliminar.click();
  await page.waitForSelector('.modal.show', { state: 'visible' });

  const btnCancelarEliminar = await page.waitForSelector('.modal.show button:has-text("Cancelar")', { state: 'attached' });
  await btnCancelarEliminar.click();

  await page.waitForSelector('.modal.delete-modal', { state: 'detached' });

  await btnEliminar.click();
  await page.waitForSelector('.modal.show', { state: 'visible' });

  const btnEliminarConfirmar = await page.waitForSelector('.modal.show button:has-text("Eliminar")', { state: 'attached' });
  await btnEliminarConfirmar.click();

  await page.waitForSelector('.modal.delete-modal', { state: 'detached' });
});
