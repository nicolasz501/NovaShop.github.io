/* =============================================
   ARCHIVO: producto.js
   ============================================= */

const params     = new URLSearchParams(window.location.search);
const idProducto = parseInt(params.get('id'), 10);
const producto   = productos.find(p => p.id === idProducto);
const contenedor = document.getElementById('producto-container');

if (!producto) {
  mostrarError();
} else {
  renderizarProducto(producto);
}


function renderizarProducto(p) {
  setTimeout(() => {
    document.getElementById('spinner').style.display = 'none';
  }, 500);
  const estrellas  = generarEstrellas(p.rating);
  const stockTexto = p.stock ? 'En Stock' : 'Agotado';
  const stockClase = p.stock ? 'product-stock' : 'product-stock agotado';

  contenedor.innerHTML = `
    <div class="product-image-col">
      <img src="${p.imagen}" alt="${p.nombre}" />
    </div>

    <div class="product-info-col">
      <span class="product-category">${p.categoria}</span>
      <h1 class="product-name">${p.nombre}</h1>

      <div class="product-rating">
        <div class="stars">${estrellas}</div>
        <span class="rating-score">${p.rating}</span>
        <span class="rating-count">(${p.reviews} reviews)</span>
      </div>

      <p class="product-price">$${p.precio.toFixed(2)}</p>
      <p class="${stockClase}">${stockTexto}</p>

      <div class="description-box">
        <h3>Descripción</h3>
        <p>${p.descripcion}</p>
      </div>

      <div class="cart-controls">
        <div class="quantity-selector">
          <button class="qty-btn" id="btn-menos">-</button>
          <input class="qty-value" id="qty-input" type="number" value="1" min="1" max="99" readonly />
          <button class="qty-btn" id="btn-mas">+</button>
        </div>

        <button class="btn-add-cart" id="btn-carrito">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
               viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Agregar al carrito
        </button>
      </div>

      <p id="msg-carrito" style="display:none; margin-top:14px; color:#16a34a; font-weight:600; font-size:0.95rem;">
        ✅ Producto agregado al carrito
      </p>
    </div>
  `;

  configurarCantidad();

  document.getElementById('btn-carrito').addEventListener('click', () => {
    const cantidad = parseInt(document.getElementById('qty-input').value, 10);
    agregarAlCarrito(p, cantidad);
  });
}

function generarEstrellas(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += '<span class="star filled">★</span>';
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      html += '<span class="star half">★</span>';
    } else {
      html += '<span class="star">★</span>';
    }
  }
  return html;
}

function configurarCantidad() {
  const input    = document.getElementById('qty-input');
  const btnMas   = document.getElementById('btn-mas');
  const btnMenos = document.getElementById('btn-menos');

  btnMas.addEventListener('click', () => {
    if (parseInt(input.value) < 99) input.value = parseInt(input.value) + 1;
  });

  btnMenos.addEventListener('click', () => {
    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
  });
}

/* =============================================
   AGREGAR AL CARRITO → localStorage
   ============================================= */
function agregarAlCarrito(p, cantidad) {
  // Leer carrito actual (o array vacío si no existe)
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

  // Buscar si el producto ya está en el carrito
  const existente = carrito.find(item => item.id === p.id);

  if (existente) {
    // Si ya existe, solo sumar la cantidad
    existente.cantidad += cantidad;
  } else {
    // Si no existe, agregarlo
    carrito.push({
      id:       p.id,
      nombre:   p.nombre,
      precio:   p.precio,
      imagen:   p.imagen,
      cantidad: cantidad
    });
  }

  // Guardar carrito actualizado
  localStorage.setItem('carrito', JSON.stringify(carrito));

  // Mostrar mensaje de confirmación
  const msg = document.getElementById('msg-carrito');
  msg.style.display = 'block';
  setTimeout(() => { msg.style.display = 'none'; }, 2500);
}

function mostrarError() {
  contenedor.innerHTML = `
    <div class="error-box">
      <h2>Producto no encontrado</h2>
      <p>El producto que buscas no existe o ha sido eliminado.</p>
      <a href="catalogo.html">← Volver al catálogo</a>
    </div>
  `;
}