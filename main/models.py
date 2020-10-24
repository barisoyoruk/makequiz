from django.db import models
from datetime import datetime
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class AccountManager(BaseUserManager):

	def create_user(self, email, password = None):
		if not email:
			raise ValueError('Users must have an email address')

		user = self.model(email = self.normalize_email(email))

		user.set_password(password)
		user.save(using = self._db)
		return user

	def create_superuser(self, email, password):
		user = self.create_user(email = self.normalize_email(email), password = password)
		user.is_superuser = True
		user.is_staff = True
		user.is_admin = True
		user.save(using = self._db)
		return user

class User(AbstractBaseUser):
	first_name = models.CharField(max_length = 30)
	last_name = models.CharField(max_length = 30)
	email = models.EmailField(max_length = 320, unique = True)
	is_superuser = models.BooleanField(default = False)
	is_staff = models.BooleanField(default = False)
	is_admin = models.BooleanField(default = False)

	USERNAME_FIELD = 'email'

	objects = AccountManager()

	def __str__(self):
		return self.email

	def has_perm(self, perm, obj = None):
		return self.is_admin

	def has_module_perms(self, app_label):
		return True

class Teacher(models.Model):
	user = models.OneToOneField(User, on_delete = models.CASCADE)
	teacher_ID = models.CharField(max_length = 10, primary_key = True)
	teacher_field = models.CharField(max_length = 30, default="default_teacher_field")

	def __str__(self):
		return self.teacher_ID

class Student(models.Model):
	user = models.OneToOneField(User, on_delete = models.CASCADE)
	student_ID = models.CharField(max_length = 10, primary_key = True)

	YEAR_IN_SCHOOL_CHOICES = [
		( 'FR', 'Freshman' ),
		( 'SO', 'Sophomore' ),
		( 'JU', 'Junior' ),
		( 'SE', 'Senior' ),
	]
	student_class = models.CharField(max_length = 10, choices = YEAR_IN_SCHOOL_CHOICES)

	def __str__(self):
		return student_ID

class Quiz(models.Model):
	quiz_topic = models.CharField(max_length = 50)
	quiz_field = models.CharField(max_length = 30)
	quiz_no = models.CharField(max_length = 2)
	grade = models.IntegerField(blank = True)	
	publication_date = models.DateTimeField('date published', default = datetime.now)
	due_date = models.DateTimeField('due date', default = datetime.now)
	
	QUIZ_STATUS = [
		('NOT_SUBMITED', 0),
		('SUBMITTED', 1),
		('GRADED', 2),
	]
	quiz_status = models.IntegerField(choices = QUIZ_STATUS)

	def __str__(self):
		return self.quiz_topic + " " + quiz_no + " " + grade 

class Question(models.Model):
	quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE)
	question_text = models.TextField(max_length = 1000)
	question_answer = models.TextField(max_length = 1000)
	question_worth = models.IntegerField()

	def __str__(self):
		return self.question_text + " " + question_worth

class Section(models.Model):
	section_code = models.CharField(primary_key=True, max_length=10) #MATH201-13

	teacher = models.ForeignKey(Teacher, on_delete = models.CASCADE)
	students = models.ManyToManyField(Student)
	quizes = models.ManyToManyField(Quiz)

	def __str__(self):
		return section_code