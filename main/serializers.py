from rest_framework import serializers
from main.models import (
	User, Teacher, Student, Section, Quiz, 
	Question, Assignment, Answer, Submission, Result
)

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['first_name', 'last_name', 'email']

class TeacherSerializer(serializers.ModelSerializer):
	user = UserSerializer()
	section = serializers.PrimaryKeyRelatedField(many = True)
	quiz = serializers.PrimaryKeyRelatedField(many = True)

	class Meta:
		model = Teacher
		fields = ['user', 'teacher_ID', 'teacher_field', 'section', 'quiz']

class StudentSerializer(serializers.ModelSerializer):
	user = UserSerializer()
	section = serializers.PrimaryKeyRelatedField(many = True)
	assignment = serializers.PrimaryKeyRelatedField(many = True)
	submission = serializers.PrimaryKeyRelatedField(many = True)

	class Meta:
		model = Student
		fields = ['user', 'student_ID', 'student_class', 'section', 'assignment', 'submission']

class SectionSerializer(serializers.ModelSerializer):
	teacher = serializers.PrimaryKeyRelatedField()
	students = serializers.PrimaryKeyRelatedField(many = True)

	class Meta:
		model = Section
		fields = ['section_code', 'semester_time', 'teacher', 'students']

class QuizSerializer(serializers.ModelSerializer):
	teacher = serializers.PrimaryKeyRelatedField()

	class Meta:
		model = Quiz
		fields = ['quiz_topic', 'quiz_field', 'quiz_no', 'teacher']


class QuestionSerializer(serializers.ModelSerializer):
	quiz = serializers.PrimaryKeyRelatedField()

	class Meta:
		model = Question
		fields = ['quiz', 'question_prompt', 'question_worth']

class AssignmentSerializer(serializers.ModelSerializer):
	student = serializers.PrimaryKeyRelatedField()
	quiz = serializers.PrimaryKeyRelatedField()

	class Meta:
		model = Assignment
		fields = ['student', 'quiz', 'publication_date', 'due_date']

class AnswerSerializer(serializers.ModelSerializer):
	question = serializers.PrimaryKeyRelatedField()

	class Meta:
		model = Answer
		fields = ['answer_text', 'question']

class SubmissionSerializer(serializers.ModelSerializer):
	quiz = serializers.PrimaryKeyRelatedField()
	student = serializers.PrimaryKeyRelatedField()
	answer = serializers.PrimaryKeyRelatedField(many = True)

	class Meta:
		model = Submission
		fields = ['quiz', 'student', 'answer']	

class ResultSerializer(serializers.ModelSerializer):
	submission = serializers.PrimaryKeyRelatedField()

	class Meta:
		model = Result
		fields = ['submission', 'grade', 'feedback']

class UserRegistrationSerializer(serializers.ModelSerializer):
	password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

	class Meta:
		model = User
		fields = [ 'first_name', 'last_name', 'email', 'password', 'password2']
		extra_kwargs = {
			'password': {'write_only': True}
		}

	def save(self):
		user = User(
			email = self.validated_data['email'], 
			first_name = self.validated_data['first_name'],
			last_name = self.validated_data['last_name'])
		password = self.validated_data['password']
		password2 = self.validated_data['password2']

		if password != password2:
			raise serializers.ValidationError({'password':'Password must match.'})

		user.set_password(password)
		user.save()
		return user

class TeacherRegistrationSerializer(serializers.ModelSerializer):

	user = UserRegistrationSerializer()

	class Meta:
		model = Teacher
		fields = ['user', 'teacher_ID', 'teacher_field']

	def create(self, validated_data):
		user_data = validated_data.pop('user')
		user_serializer = UserRegistrationSerializer(data = user_data)

		if user_serializer.is_valid():
			new_user = user_serializer.save()
			teacher = Teacher.objects.create(user = new_user, **validated_data)
		return teacher

class StudentRegistrationSerializer(serializers.ModelSerializer):
	user = UserRegistrationSerializer()

	class Meta:
		model = Student
		fields = ['user', 'teacher_ID', 'teacher_field']

	def create(self, validated_data):
		user_data = validated_data.pop('user')
		user_serializer = UserRegistrationSerializer(data = user_data)

		if user_serializer.is_valid():
			new_user = user_serializer.save()
			student = Student.objects.create(user = new_user, **validated_data)
		return teacher