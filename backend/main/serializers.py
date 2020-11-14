from rest_framework import serializers
from main.models import (
	User, Teacher, Student, Section, Quiz, 
	Question, Assignment, Answer, Submission, Result
)

#Serializers for GET and DELETE
class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['first_name', 'last_name', 'email']

class TeacherSerializer(serializers.ModelSerializer):
	user = UserSerializer()
	section = serializers.PrimaryKeyRelatedField(read_only = True, many = True)
	quiz = serializers.PrimaryKeyRelatedField(read_only = True, many = True)

	class Meta:
		model = Teacher
		fields = ['user', 'teacher_ID', 'teacher_field', 'section', 'quiz']

class StudentSerializer(serializers.ModelSerializer):
	user = UserSerializer()
	section = serializers.PrimaryKeyRelatedField(read_only = True, many = True)
	assignment = serializers.PrimaryKeyRelatedField(read_only = True, many = True)
	submission = serializers.PrimaryKeyRelatedField(read_only = True, many = True)

	class Meta:
		model = Student
		fields = ['user', 'student_ID', 'student_class', 'section', 'assignment', 'submission']

class SectionSerializer(serializers.ModelSerializer):
	teacher = serializers.PrimaryKeyRelatedField(read_only = True)
	students = serializers.PrimaryKeyRelatedField(read_only = True, many = True)

	class Meta:
		model = Section
		fields = ['section_code', 'semester_time', 'teacher', 'students']

class QuizSerializer(serializers.ModelSerializer):
	teacher = serializers.PrimaryKeyRelatedField(read_only = True)
	question = serializers.PrimaryKeyRelatedField(read_only = True, many = True)

	class Meta:
		model = Quiz
		fields = ['quiz_topic', 'quiz_field', 'quiz_no', 'teacher', 'question']

class QuestionSerializer(serializers.ModelSerializer):
	quiz = serializers.PrimaryKeyRelatedField(read_only = True)

	class Meta:
		model = Question
		fields = ['quiz', 'question_prompt', 'question_worth']

class AssignmentSerializer(serializers.ModelSerializer):
	student = serializers.PrimaryKeyRelatedField(read_only = True)
	quiz = serializers.PrimaryKeyRelatedField(read_only = True)

	class Meta:
		model = Assignment
		fields = ['student', 'quiz', 'publication_date', 'due_date']

class AnswerSerializer(serializers.ModelSerializer):
	question = serializers.PrimaryKeyRelatedField(read_only = True)

	class Meta:
		model = Answer
		fields = ['answer_text', 'question']

class SubmissionSerializer(serializers.ModelSerializer):
	quiz = serializers.PrimaryKeyRelatedField(read_only = True)
	student = serializers.PrimaryKeyRelatedField(read_only = True)
	answer = serializers.PrimaryKeyRelatedField(read_only = True, many = True)

	class Meta:
		model = Submission
		fields = ['quiz', 'student', 'answer']	

class ResultSerializer(serializers.ModelSerializer):
	submission = serializers.PrimaryKeyRelatedField(read_only = True)

	class Meta:
		model = Result
		fields = ['submission', 'grade', 'feedback']

#Serializers for POST
class UserRegistrationSerializer(serializers.ModelSerializer):
	password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

	class Meta:
		model = User
		fields = [ 'first_name', 'last_name', 'email', 'password', 'password2', 'user_type']
		extra_kwargs = {
			'password': {'write_only': True}
		}

	def save(self):
		user = User(
			email = self.validated_data['email'], 
			first_name = self.validated_data['first_name'],
			last_name = self.validated_data['last_name'],
			user_type = self.validated_data['user_type'],)
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
			new_teacher = Teacher.objects.create(user = new_user, **validated_data)
		return new_teacher

class StudentRegistrationSerializer(serializers.ModelSerializer):
	user = UserRegistrationSerializer()

	class Meta:
		model = Student
		fields = ['user', 'student_ID', 'student_class']

	def create(self, validated_data):
		user_data = validated_data.pop('user')
		user_serializer = UserRegistrationSerializer(data = user_data)

		if user_serializer.is_valid():
			new_user = user_serializer.save()
			student = Student.objects.create(user = new_user, **validated_data)
		return student

class SectionCreateSerializer(serializers.ModelSerializer):
	teacher = serializers.PrimaryKeyRelatedField(queryset = Teacher.objects.all())

	class Meta:
		model = Section
		fields = ['teacher', 'section_code', 'semester_time']

class QuizCreateSerializer(serializers.ModelSerializer):
	teacher = serializers.PrimaryKeyRelatedField(queryset = Teacher.objects.all())

	class Meta:
		model = Quiz
		fields = ['teacher', 'quiz_topic', 'quiz_field', 'quiz_no']


class QuestionCreateSerializer(serializers.ModelSerializer):
	quiz = serializers.PrimaryKeyRelatedField(queryset = Quiz.objects.all())

	class Meta:
		model = Question
		fields = ['quiz', 'question_prompt', 'question_worth']


class AssignmentCreateSerializer(serializers.ModelSerializer):
	student = serializers.PrimaryKeyRelatedField(queryset = Student.objects.all())
	quiz = serializers.PrimaryKeyRelatedField(queryset = Quiz.objects.all())

	class Meta:
		model = Assignment
		fields = ['student', 'quiz', 'publication_date', 'due_date']

class SubmissionCreateSerializer(serializers.ModelSerializer):
	quiz = serializers.PrimaryKeyRelatedField(queryset = Quiz.objects.all())
	student = serializers.PrimaryKeyRelatedField(queryset = Student.objects.all() )

	class Meta:
		model = Submission
		fields = ["student", "quiz", "submission_date"]

class AnswerCreateSerializer(serializers.ModelSerializer):
	submission = serializers.PrimaryKeyRelatedField(queryset = Submission.objects.all())
	question = serializers.PrimaryKeyRelatedField(queryset = Question.objects.all())

	class Meta:
		model = Answer
		fields = ["submission", "question", "answer_text"]

class ResultCreateSerializer(serializers.ModelSerializer):
	submission = serializers.PrimaryKeyRelatedField(queryset = Submission.objects.all())

	class Meta:
		model = Result
		fields = ["submission", "feedback", "grade"]

#Serializers for PUT
class SectionStudentAdditionSerializer(serializers.ModelSerializer):
	students = serializers.PrimaryKeyRelatedField(many = True, queryset = Student.objects.all())

	class Meta:
		model = Section
		fields = ['students']

	def save(self):
		students = self.validated_data.pop('students')

		for student in students:
			if not student in self.instance.students.all():
				self.instance.students.add(student)
				return self.instance
			else:
				raise serializers.ValidationError({'students':'Some students have already existed in the section'})