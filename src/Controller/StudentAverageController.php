<?php

namespace App\Controller;

use App\Entity\Student;
use App\Repository\GradeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class StudentAverageController extends AbstractController
{
    protected $gradeRepository;

    public function __construct(GradeRepository $gradeRepository)
    {
        $this->gradeRepository = $gradeRepository;
    }

    /**
     * @param Student $data
     * @return object
     */
    public function __invoke(Student $data): object
    {
        $average = $this->gradeRepository->averageOfStudentGrades($data->getId());

        return new JsonResponse($average);
    }
}