<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\StudentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Controller\StudentAverageController;
use App\Controller\AllStudentsAverageController;
use App\Controller\StudentGradeController;

/**
 * @ApiResource(
 *     normalizationContext={"groups"={"read:student"}},
 *     collectionOperations={
 *      "get",
 *      "post"={"normalization_context"={"groups"="post:student"}},
 *      "average"={"method"="GET","path"="/students/average","controller"=AllStudentsAverageController::class}
 *     },
 *     itemOperations={
 *      "put"={"denormalization_context"={"groups"="put:student"}},
 *      "delete",
 *      "get",
 *      "average"={"method"="GET","path"="/student/{id}/average","controller"=StudentAverageController::class},
 *      "grades"={"method"="GET","path"="/student/{id}/grades","controller"=StudentGradeController::class}
 *    }
 * )
 * @ORM\Entity(repositoryClass=StudentRepository::class)
 */


class Student
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"read:student", "read:grade"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({"read:student", "read:grade", "post:student", "put:student"})
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({"read:student", "read:grade", "post:student", "put:student"})
     */
    private $lastName;

    /**
     * @ORM\Column(type="date", nullable=true)
     * @Groups({"read:student", "post:student", "put:student"})
     */

    private $birthDate;

    /**
     * @ORM\OneToMany(targetEntity=Grade::class, mappedBy="student", orphanRemoval=true)
     * @Groups({"read:student"})
     */
    private $grade;

    public function __construct()
    {
        $this->grade = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate(?\DateTimeInterface $birthDate): self
    {
        $this->birthDate = $birthDate;

        return $this;
    }

    /**
     * @return Collection|Grade[]
     */
    public function getGrade(): Collection
    {
        return $this->grade;
    }

    public function addGrade(Grade $grade): self
    {
        if (!$this->grade->contains($grade)) {
            $this->grade[] = $grade;
            $grade->setStudent($this);
        }

        return $this;
    }

    public function removeGrade(Grade $grade): self
    {
        if ($this->grade->removeElement($grade)) {
            // set the owning side to null (unless already changed)
            if ($grade->getStudent() === $this) {
                $grade->setStudent(null);
            }
        }

        return $this;
    }
}
