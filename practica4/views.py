import logging
import os
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import HttpResponse, FileResponse, JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from practica4.models import Tarea, Etiqueta, Usuario
from practica4.serializers import TareaSerializer, UsuarioSerializer
from practica4.serializers import RegistroUsuarioSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from practica4.models import Usuario
from practica4.serializers import UsuarioSerializer


logger = logging.getLogger(__name__)

class LoginUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Obtener los datos enviados desde el frontend (username y password)
        username = request.data.get('username')
        password = request.data.get('password')

        # Autenticación de usuario
        user = authenticate(username=username, password=password)
        if user is not None:
            # Si las credenciales son correctas, generar el token JWT
            refresh = RefreshToken.for_user(user)

            # Obtener el ID de la tabla personalizada (practica4_usuario)
            try:
                usuario = Usuario.objects.get(user=user)  # Asumimos que tienes una relación ForeignKey entre Usuario y User
                user_id = usuario.id  # El id de la tabla practica4_usuario
            except Usuario.DoesNotExist:
                return Response({'error': 'Usuario no encontrado en la tabla personalizada.'}, status=status.HTTP_404_NOT_FOUND)

            # Retornar el token de acceso, el token de actualización y el ID del usuario desde la tabla practica4_usuario
            return Response({
                'access': str(refresh.access_token),  # Token de acceso
                'refresh': str(refresh),  # Token de actualización
                'userId': user_id,  # ID del usuario desde la tabla practica4_usuario
            })
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterUser(APIView):
    """
    Vista para registrar un nuevo usuario sin necesidad de autenticación.
    """
    authentication_classes = []  # Deshabilitar cualquier clase de autenticación
    permission_classes = [AllowAny]  # Permitir acceso a cualquier usuario

    def post(self, request):
        serializer = RegistroUsuarioSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            return Response(
                {"message": "Usuario registrado exitosamente", "user": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ListaTareasView(APIView):
    """
    Gestiona la lista de tareas: listar, crear y filtrar.
    """
    permission_classes = [IsAuthenticated]  # Requiere autenticación

    def get(self, request):
        # Filtrar por estado, prioridad o etiquetas si se proporcionan en los parámetros
        estado = request.query_params.get('estado')
        prioridad = request.query_params.get('prioridad')
        etiqueta = request.query_params.get('etiqueta')
        
        tareas = Tarea.objects.filter(usuario=request.user.perfil)

        if estado:
            tareas = tareas.filter(estado=estado)
        if prioridad:
            tareas = tareas.filter(prioridad=prioridad)
        if etiqueta:
            tareas = tareas.filter(etiquetas__nombre=etiqueta)

        serializer = TareaSerializer(tareas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    

    def post(self, request):
        # Asignar la tarea al usuario autenticado
        data = request.data.copy()
        data['usuario'] = request.user.perfil.id
        
        serializer = TareaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListaTareasPublicasView(APIView):
    """
    Devuelve todas las tareas públicas sin importar el usuario que las haya creado.
    """
    permission_classes = [IsAuthenticated]  # Requiere autenticación

    def get(self, request):
        # Obtiene solo las tareas con visibilidad pública
        tareas_publicas = Tarea.objects.filter(visibilidad='publico')
        serializer = TareaSerializer(tareas_publicas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class RegisterUser(APIView):
    """
    Vista para registrar un nuevo usuario.
    """
    def post(self, request):
        # Obtener los datos desde la solicitud
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Crear el usuario
        user = User.objects.create_user(username=username, email=email, password=password)

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

class ListaEtiquetasView(APIView):
    """
    Gestiona la lista de etiquetas: listar y crear.
    """
    permission_classes = [IsAuthenticated]  # Requiere autenticación

    def get(self, request):
        etiquetas = Etiqueta.objects.all()
        return Response([{'id': etiqueta.id, 'nombre': etiqueta.nombre} for etiqueta in etiquetas], status=status.HTTP_200_OK)

    def post(self, request):
        nombre = request.data.get('nombre')
        if not nombre:
            return Response({'error': 'El campo nombre es obligatorio'}, status=status.HTTP_400_BAD_REQUEST)

        etiqueta, creada = Etiqueta.objects.get_or_create(nombre=nombre)
        return Response({'id': etiqueta.id, 'nombre': etiqueta.nombre}, status=status.HTTP_201_CREATED if creada else status.HTTP_200_OK)


class CrearTareaView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Obtenemos los datos necesarios
        usuario = request.user.perfil  # El usuario está en el perfil asociado con el modelo Usuario
        titulo = request.data.get('titulo')
        descripcion = request.data.get('descripcion')
        estado = request.data.get('estado', 'pendiente')
        visibilidad = request.data.get('visibilidad', 'privado')
        prioridad = request.data.get('prioridad', 'media')
        etiquetas = request.data.get('etiquetas', [])
        fecha_vencimiento = request.data.get('fecha_vencimiento', None)

        # Validación básica
        if not titulo or not descripcion:
            return Response({"error": "El título y la descripción son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la tarea
        tarea = Tarea.objects.create(
            usuario=usuario,
            titulo=titulo,
            descripcion=descripcion,
            estado=estado,
            visibilidad=visibilidad,
            prioridad=prioridad,
            fecha_vencimiento=fecha_vencimiento
        )

        # Asignar etiquetas, si hay
        for etiqueta_id in etiquetas:
            try:
                etiqueta = Etiqueta.objects.get(id=etiqueta_id)
                tarea.etiquetas.add(etiqueta)
            except Etiqueta.DoesNotExist:
                return Response({"error": f"Etiqueta con id {etiqueta_id} no encontrada."}, status=status.HTTP_400_BAD_REQUEST)

        # Guardar la tarea con las etiquetas
        tarea.save()

        # Serializar la tarea creada
        serializer = TareaSerializer(tarea)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DetalleTareaView(APIView):
    """
    Vista para manejar una tarea específica.
    Permite acceder, actualizar y eliminar una tarea.
    """
    permission_classes = [IsAuthenticated]  # Requiere autenticación

    def get(self, request, pk):
        """
        Devuelve los detalles de una tarea específica si pertenece al usuario autenticado.
        """
        tarea = get_object_or_404(Tarea, pk=pk, usuario=request.user.perfil)
        serializer = TareaSerializer(tarea)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """
        Actualiza una tarea específica si pertenece al usuario autenticado.
        """
        tarea = get_object_or_404(Tarea, pk=pk, usuario=request.user.perfil)
        serializer = TareaSerializer(tarea, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Elimina una tarea específica si pertenece al usuario autenticado.
        """
        tarea = get_object_or_404(Tarea, pk=pk, usuario=request.user.perfil)
        tarea.delete()
        return Response({"message": "Tarea eliminada exitosamente."}, status=status.HTTP_204_NO_CONTENT)
