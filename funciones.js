document.addEventListener("DOMContentLoaded", () => {
  // Inicializar EmailJS
  emailjs.init("aS90PMQRmjhZsWQU6"); // Public Key

  // Referencias
  const contactoLink = document.querySelector('a[href="#contacto"]');
  const modal = document.getElementById("contact-modal");
  const closeModal = document.getElementById("close-modal");
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const timeInput = document.getElementById("time");

  // Abrir modal al hacer clic en "Contacto"
  if (contactoLink) {
    contactoLink.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.remove("hidden");
    });
  }

  // Cerrar modal con botón
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Cerrar modal al hacer clic fuera
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }

  // Enviar formulario con EmailJS
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Insertar fecha/hora actual en el campo oculto
      timeInput.value = new Date().toLocaleString();

      emailjs.sendForm("service_xoaa0x8", "template_0zfb912", this)

        .then(() => {
          status.textContent = "✅ Tu mensaje ha sido enviado con éxito.";
          status.classList.remove("hidden");
          status.classList.add("text-green-600");
          form.reset();
        }, (err) => {
          status.textContent = "❌ Ocurrió un error, inténtalo más tarde.";
          status.classList.remove("hidden");
          status.classList.add("text-red-600");
          console.error("Error:", err);
        });
    });
  }
});

//------------------------------------------------------
// Inicializar mapa (por defecto centrado en El Salvador)
// Inicializar mapa (por defecto centrado en El Salvador)
var map = L.map('map').setView([13.6929, -89.2182], 9);

// Cargar tiles de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// Definir un ícono rojo para los puntos fijos
var redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
  iconSize: [25, 41],   // tamaño del ícono
  iconAnchor: [12, 41], // punto del ícono que corresponde a la ubicación
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Puntos fijos registrados
var puntos = [
  { nombre: "San Miguel", coords: [13.482470346661819, -88.17544416789289] },
  { nombre: "Moncagua", coords: [13.532848658385086, -88.25523444484458] },
  { nombre: "La Union", coords: [13.33787149431345, -87.8434127639026] }
];

// Agregar marcadores con ícono rojo
puntos.forEach(p => {
  L.marker(p.coords, { icon: redIcon }).addTo(map).bindPopup(p.nombre);
});

// Función para calcular distancia entre dos coordenadas (Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return x * Math.PI / 180;
  }

  var R = 6371; // Radio de la tierra en km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Detectar ubicación del usuario
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(pos) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;

    // Marcador en la ubicación del usuario (azul por defecto)
    var userMarker = L.marker([lat, lng]).addTo(map).bindPopup("Tu ubicación");
    map.setView([lat, lng], 12);

    // Buscar punto más cercano
    var masCercano = null;
    var distanciaMin = Infinity;

    puntos.forEach(p => {
      var d = calcularDistancia(lat, lng, p.coords[0], p.coords[1]);
      if (d < distanciaMin) {
        distanciaMin = d;
        masCercano = p;
      }
    });

    // Mostrar ruta SOLO hacia el punto más cercano
    // Mostrar ruta SOLO hacia el punto más cercano
if (masCercano) {
  L.Routing.control({
    waypoints: [
      L.latLng(lat, lng),
      L.latLng(masCercano.coords[0], masCercano.coords[1])
    ],
    routeWhileDragging: false,
    show: false,
    createMarker: function(i, waypoint, n) {
      if (i === 0) {
        // Tu ubicación (verde)
        return L.marker(waypoint.latLng, {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
            shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).bindPopup("Tu ubicación");
      } else {
        // Punto más cercano (rojo con popup del nombre)
        return L.marker(waypoint.latLng, { icon: redIcon })
          .bindPopup(masCercano.nombre);
      }
    }
  }).addTo(map);
}


  }, function() {
    alert("No se pudo obtener tu ubicación.");
  });
} else {
  alert("La geolocalización no está soportada en tu navegador.");
}
