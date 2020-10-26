from django.urls import path

from main.views import (
	api_detail_teacher_view, 
	api_detail_student_view, 
	api_detail_section_view,
	api_detail_quiz_view, 
	QuestionViewSet,
	api_detail_assignment_view,
	api_detail_answer_view,
	api_detail_submission_view,
	api_detail_result_view,
	api_teacher_registration_view,
	api_student_registration_view,
	api_section_create_view,
	api_quiz_create_view,
	QuestionCreateViewSet,
)

app_name = 'main'

urlpatterns = [
	path('teacher/<pk>', api_detail_teacher_view),
	path('student/<pk>', api_detail_student_view),
	path('section/<pk>', api_detail_section_view),
	path('quiz/<pk>', api_detail_quiz_view),
	path('question/<pk>', QuestionViewSet.as_view()),
	path('assignment/<pk>', api_detail_assignment_view ),
	path('answer/<pk>', api_detail_answer_view ),
	path('submission/<pk>', api_detail_submission_view ),
	path('result/<pk>', api_detail_result_view ),
	path('teacher/register/', api_teacher_registration_view),
	path('student/register/', api_student_registration_view),
	path('section/create/', api_section_create_view),
	path('quiz/create/', api_quiz_create_view),
	path('question/create/', QuestionCreateViewSet.as_view()),
]