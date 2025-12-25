from django.contrib import admin
from .models import User, Todo, Post, Photo

admin.site.register(User)
admin.site.register(Todo)
admin.site.register(Post)
admin.site.register(Photo)