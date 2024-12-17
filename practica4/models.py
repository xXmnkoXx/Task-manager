from django.db import models
from django.contrib.auth.models import User


class Usuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="perfil")
    nombre_completo = models.CharField(max_length=255, null=True, blank=True)
    imagen_perfil = models.ImageField(upload_to='usuarios/', null=True, blank=True)

    def __str__(self):
        return self.nombre_completo or self.user.username


class Etiqueta(models.Model):
    nombre = models.CharField(max_length=50, unique=True, verbose_name="Nombre de la etiqueta")

    def __str__(self):
        return self.nombre


class Tarea(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('completada', 'Completada'),
    ]

    VISIBILIDAD = [
        ('publico', 'Público'),
        ('privado', 'Privado'),
    ]

    PRIORIDADES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
    ]

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="tareas",
        verbose_name="Usuario"
    )
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='pendiente',
        verbose_name="Estado de la tarea"
    )
    visibilidad = models.CharField(
        max_length=10,
        choices=VISIBILIDAD,
        default='privado',
        verbose_name="Visibilidad"
    )
    prioridad = models.CharField(
        max_length=10,
        choices=PRIORIDADES,
        default='media',
        verbose_name="Prioridad"
    )
    etiquetas = models.ManyToManyField(
        Etiqueta,
        blank=True,
        related_name="tareas",
        verbose_name="Etiquetas"
    )
    fecha_vencimiento = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Fecha de vencimiento"
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    ultima_edicion = models.DateTimeField(auto_now=True, verbose_name="Última edición")

    def __str__(self):
        return (
            f"{self.titulo} - {self.get_estado_display()} - {self.get_visibilidad_display()} - "
            f"Prioridad: {self.get_prioridad_display()}"
        )

    class Meta:
        verbose_name = "Tarea"
        verbose_name_plural = "Tareas"
        ordering = ['-fecha_creacion']
