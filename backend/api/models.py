from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(default="user@netfake.com")

    def __str__(self):
        return self.name

class Todo(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    # Usamos IntegerField para simular o relacionamento simples do json-server
    userId = models.IntegerField(default=1) 

    def __str__(self):
        return self.title

class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    userId = models.IntegerField(default=1)

    def __str__(self):
        return self.title

class Photo(models.Model):
    title = models.CharField(max_length=200)
    url = models.URLField()
    thumbnailUrl = models.URLField(blank=True, null=True)
    albumId = models.IntegerField(default=1)

    def __str__(self):
        return self.title