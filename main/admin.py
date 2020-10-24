from django.contrib import admin

from main.models import Teacher, Student, Quiz, Question, User
# Register your models here.

admin.site.register(Teacher)
admin.site.register(Student)
admin.site.register(Question)
admin.site.register(Quiz)
admin.site.register(User)