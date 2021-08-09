<?php

namespace App\Controller;

use App\Entity\Student;
use App\Repository\GradeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class StudentGradeController extends AbstractController
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
    public function __invoke(Student $data):array
    {
        return $this->gradeRepository->getGradesByStudent($data->getId());
    }
}