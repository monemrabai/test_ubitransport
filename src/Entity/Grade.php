<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\GradeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     normalizationContext={"groups"={"read:grade"}},
 *     collectionOperations={"get", "post"={"normalization_context"={"groups"="post:grade"}}},
 *     itemOperations={"get"}
 * )
 * @ORM\Entity(repositoryClass=GradeRepository::class)
 */

class Grade
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"read:grade", "read:student", "post:grade"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Assert\Length(
     *     min = 0,
     *     max = 20,
     *     groups={"post:grade"}
     * )
     * @Groups({"read:grade", "read:student", "post:grade"})
     */
    private $value;

    /**
     * @ORM\Column(type="string", length=100)
     * @Groups({"read:grade", "read:student", "post:grade"})
     */
    private $subject;

    /**
     * @ORM\ManyToOne(targetEntity=Student::class, inversedBy="grade")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"read:grade", "post:grade"})
     *
     */
    private $student;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getValue(): ?float
    {
        return $this->value;
    }

    public function setValue(?float $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function setSubject(?string $subject): self
    {
        $this->subject = $subject;

        return $this;
    }

    public function getStudent(): ?Student
    {
        return $this->student;
    }

    public function setStudent(?Student $student): self
    {
        $this->student = $student;

        return $this;
    }
}
