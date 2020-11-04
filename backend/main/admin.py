from django.contrib import admin

from main.models import (
	User, Teacher, Student, Section, Quiz, 
	Question, Assignment, Answer, Submission, Result
)
# Register your models here.

admin.site.register(User)
admin.site.register(Teacher)
admin.site.register(Student)
admin.site.register(Section)
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Assignment)
admin.site.register(Answer)
admin.site.register(Submission)
admin.site.register(Result)