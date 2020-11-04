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

	teacher_ID = models.CharField(max_length = 10, unique = True)
	teacher_field = models.CharField(max_length = 30)

	def __str__(self):
		return self.teacher_ID

class Student(models.Model):
	user = models.OneToOneField(User, on_delete = models.CASCADE)

	student_ID = models.CharField(max_length = 10, unique = True)
	YEAR_IN_SCHOOL_CHOICES = [
		( 'FR', 'Freshman' ),
		( 'SO', 'Sophomore' ),
		( 'JU', 'Junior' ),
		( 'SE', 'Senior' ),
	]
	student_class = models.CharField(max_length = 10, choices = YEAR_IN_SCHOOL_CHOICES)

	def __str__(self):
		return self.student_ID

class Section(models.Model):
	teacher = models.ForeignKey(Teacher, on_delete = models.CASCADE, related_name = "section")
	students = models.ManyToManyField(Student, related_name = "section")
	
	section_code = models.CharField(unique = True, max_length = 10) #MATH201-13
	semester_time = models.CharField(max_length = 11 ) #2019-SPRING

	def __str__(self):
		return self.section_code

class Quiz(models.Model):
	teacher = models.ForeignKey(Teacher, on_delete = models.CASCADE, related_name = "quiz")

	quiz_topic = models.CharField(max_length = 50)
	quiz_field = models.CharField(max_length = 30)
	quiz_no = models.CharField(max_length = 2)

class Question(models.Model):
	quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE, related_name = "question")

	question_prompt = models.TextField(max_length = 1000)
	question_worth = models.IntegerField()

class Assignment(models.Model):
	student = models.ForeignKey(Student, on_delete = models.CASCADE, related_name = "assignment")
	quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE, related_name = "assignment")

	publication_date = models.DateTimeField('date published')
	due_date = models.DateTimeField('due date')

class Submission(models.Model):
	quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE, related_name = "submission")
	student = models.ForeignKey(Student, on_delete = models.CASCADE, related_name = "submission")

	submission_date = models.DateTimeField('date submitted')

class Answer(models.Model):
	submission = models.ForeignKey(Submission, on_delete = models.CASCADE, related_name = "answer")
	question = models.ForeignKey(Question, on_delete = models.CASCADE, related_name = "answer")

	answer_text = models.CharField(max_length = 1000)

class Result(models.Model):
	submission = models.OneToOneField(Submission, on_delete = models.CASCADE, related_name = "result")

	feedback = models.CharField(max_length = 1000)
	grade = models.IntegerField()
