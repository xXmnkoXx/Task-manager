# practica4/urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from . import views  # Asegúrate de importar las vistas si es necesario
from .views import CrearTareaView, DetalleTareaView, ListaTareasPublicasView, RegisterUser, LoginUser, ListaTareasView, ListaEtiquetasView

urlpatterns = [
    path('admin/', admin.site.urls),  # Administración de Django
    path('register/', RegisterUser.as_view(), name='register'),
    path('login/', LoginUser.as_view(), name='login'),  # Login de usuarios
    path('api/tareas/', ListaTareasView.as_view(), name='lista_tareas'),  # Listar y crear tareas
    path('api/etiquetas/', ListaEtiquetasView.as_view(), name='lista_etiquetas'),  # Listar y crear etiquetas
    path('api/tareas-publicas/', ListaTareasPublicasView.as_view(), name='tareas_publicas'),
    path('api/tareas/crear/', CrearTareaView.as_view(), name='crear-tarea'),
    path('api/tareas/<int:pk>/', DetalleTareaView.as_view(), name='detalle_tarea'),

]

# Servir archivos estáticos y de medios durante el desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
