<?php

namespace App\Repository;

use App\Entity\Grade;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Grade|null find($id, $lockMode = null, $lockVersion = null)
 * @method Grade|null findOneBy(array $criteria, array $orderBy = null)
 * @method Grade[]    findAll()
 * @method Grade[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GradeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Grade::class);
    }

    /**
     * @param $id
     * @return Grade[] Returns the average of a given student's grades
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function averageOfStudentGrades($id=null)
    {
        $averageOfStudent = $this->createQueryBuilder('g')
            ->andWhere('g.student = :studentId')
            ->setParameter('studentId', $id)
            ->select("avg(g.value)")
            ->getQuery()
            ->getSingleScalarResult();

        return number_format($averageOfStudent, 2, '.', '');
    }

    /**
     * @return Returns the average of the students' marks
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getAverageOfAllGrades()
    {
         $agerageOfGrades = $this->createQueryBuilder('g')
            ->select("avg(g.value)")
            ->getQuery()
            ->getSingleScalarResult();

        return number_format($agerageOfGrades, 2, '.', '');
    }

    /**
     * @param $id
     * @return Returns grades of student's
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getGradesByStudent($id=null)
    {
         return $this->createQueryBuilder('g')
             ->andWhere('g.student = :studentId')
             ->setParameter('studentId', $id)
             ->getQuery()
             ->execute();
    }
}
