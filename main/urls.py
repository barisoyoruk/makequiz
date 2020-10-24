from django.urls import path

from main.views import (
	api_detail_section_view,
	api_detail_teacher_view, 
	api_teacher_registration_view,
	api_student_registration_view,
	api_detail_student_view, 
	api_detail_quiz_view, 
	api_detail_question_view,
	api_create_quiz_view,
	api_create_question_view,
)

app_name = 'main'

urlpatterns = [
	path('section/<pk>', api_detail_section_view),
	path('teacher/<pk>', api_detail_teacher_view),
	path('student/<pk>', api_detail_student_view),
	path('quiz/<pk>', api_detail_quiz_view),
	path('question/<pk>', api_detail_question_view ),
	path('teacher/register/', api_teacher_registration_view),
	path('student/register/', api_student_registration_view),
	path('quiz/create/', api_create_quiz_view),
	path('question/create/', api_create_question_view),
]