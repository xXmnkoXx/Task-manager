from rest_framework import serializers
from .models import Post

class SubirPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['titulo', 'contenido', 'imagen_url']  # Campos necesarios para subir un post
