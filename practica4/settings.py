import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = 'django-insecure-&e*c!fg-7!++ii%6*yh1&2)x8!g-9)smk0&v(r#(h3b!gq7p0!'
DEBUG = True
ALLOWED_HOSTS = ['*']  # Permitir todas las direcciones IP y dominios (solo para desarrollo)

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React frontend
    "http://192.168.1.132:3000",  # IP específica en la red local
]
CORS_ALLOW_ALL_ORIGINS = False  # Permitir solo los definidos en CORS_ALLOWED_ORIGINS
CORS_ALLOW_CREDENTIALS = True  # Permite uso de credenciales (como cookies o tokens)

# Applications
INSTALLED_APPS = [
    'corsheaders',  # Permitir solicitudes CORS
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',  # Framework para crear APIs
    'rest_framework_simplejwt',  # Autenticación JWT
    'practica4',  # Tu aplicación
]

# Middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS Middleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URL Configuration
ROOT_URLCONF = 'practica4.urls'

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # Define rutas a plantillas personalizadas si las tienes
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI Configuration
WSGI_APPLICATION = 'practica4.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'practica4',  # Nombre de tu base de datos
        'USER': 'postgres',   # Usuario de tu base de datos
        'PASSWORD': 'Madelman18',  # Contraseña de la base de datos
        'HOST': 'localhost',  # Dirección del servidor de base de datos
        'PORT': '5432',       # Puerto de PostgreSQL
    }
}

# Authentication
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # Usar JWT para autenticación
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # Requiere autenticación por defecto
    ],
}

# Static files
STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]  # Ruta a archivos estáticos en desarrollo
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Directorio para recolectar archivos estáticos

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')  # Directorio para archivos subidos por usuarios

# Localization
LANGUAGE_CODE = 'es-es'  # Cambiado a español
TIME_ZONE = 'Europe/Madrid'  # Configuración horaria
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# JWT Configuration
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),  # Duración del token de acceso
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),  # Duración del token de refresco
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
