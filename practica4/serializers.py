from rest_framework import serializers
from practica4.models import Tarea, Etiqueta, Usuario
from django.contrib.auth.models import User
from rest_framework import serializers



class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = ['id', 'nombre']  # Incluye solo los campos necesarios del modelo Etiqueta

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre_completo', 'user']  # Incluye campos relevantes del modelo Usuario

class TareaSerializer(serializers.ModelSerializer):
    etiquetas = serializers.SlugRelatedField(queryset=Etiqueta.objects.all(), slug_field='nombre', many=True)
    usuario = UsuarioSerializer(read_only=True)  # Incluye el UsuarioSerializer para expandir el usuario

    class Meta:
        model = Tarea
        fields = [
            'id',
            'usuario',  # Este campo ahora contendrá los datos detallados del usuario
            'titulo',
            'descripcion',
            'estado',
            'visibilidad',
            'prioridad',
            'etiquetas',
            'fecha_vencimiento',
            'fecha_creacion',
            'ultima_edicion',
        ]
        read_only_fields = ['fecha_creacion', 'ultima_edicion']


class RegistroUsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para registrar un nuevo usuario.
    Maneja la creación en `auth_user` y `practica4_usuario`.
    """
    username = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    nombre_completo = serializers.CharField(max_length=255, required=True)

    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password', 'nombre_completo']

    def validate(self, data):
        """
        Validaciones personalizadas para el registro.
        """
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': 'El nombre de usuario ya existe.'})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'El correo electrónico ya está registrado.'})
        return data

    def create(self, validated_data):
        """
        Crea un usuario en `auth_user` y su perfil en `practica4_usuario`.
        """
        # Crear usuario en auth_user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        # Crear perfil en practica4_usuario
        usuario = Usuario.objects.create(
            user=user,
            nombre_completo=validated_data['nombre_completo']
        )

        return usuario